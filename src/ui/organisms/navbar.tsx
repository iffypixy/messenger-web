import React from "react";
import styled from "styled-components";

import {UserAvatar} from "@features/user";

const link = "https://sun1.beeline-kz.userapi.com/impf/c845419/v845419855/1a64bb/ZiPNWiIH6CU.jpg?size=50x0&quality=96&crop=0,210,990,990&sign=f4f42f615dd1ecb236da6604b5d737c9&ava=1";

export const Navbar: React.FC = () => (
    <Wrapper>

        
        <Avatar src={link} />
    </Wrapper>
);

const Wrapper = styled.div`
    display: flex;
    width: 10%;
    background-color: ${(({theme}) => theme.palette.primary.main)};
`;

const Avatar = styled(UserAvatar)`
    display: none;

    @media only screen and (min-width: ${({theme}) => theme.breakpoints.md}) {
        display: block;
    }
`;