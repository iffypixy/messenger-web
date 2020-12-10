import Fingerprint from "fingerprintjs2";
import UAParser from "ua-parser-js";

const options: Fingerprint.Options = {
  excludes: {
    plugins: true,
    localStorage: true,
    adBlock: true,
    screenResolution: true,
    availableScreenResolution: true,
    enumerateDevices: true,
    pixelRatio: true,
    doNotTrack: true
  },
  preprocessor: (key, value: string) => {
    if (key === "userAgent") {
      const {getOS, getBrowser, getEngine} = new UAParser(value);

      return `${getOS().name} :: ${getBrowser().name} :: ${getEngine().name}`;
    }

    return value
  }
};

export const getFingerprint = (): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const genHash = async () => {
      try {
        const components = await Fingerprint.getPromise(options);

        const fingerprint = Fingerprint.x64hash128(components.map(({value}) => value).join(""), 31);

        resolve(fingerprint);
      } catch (error) {
        reject(error);
      }
    };

    return requestIdleCallback(genHash);
  });
};