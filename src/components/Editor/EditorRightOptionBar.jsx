import React, {useState } from "react";
import styled from "styled-components";
import { BiCodeCurly } from "react-icons/bi";
import { GoListOrdered, GoListUnordered } from "react-icons/go";
import { ImLink } from "react-icons/im";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import {
    FaHeading,
    FaQuoteLeft,
    FaCode,
    FaMarkdown,
    FaBold,
    FaItalic,
} from "react-icons/fa";
import { FiCamera } from "react-icons/fi";

export const EditorRightOptionBar = (
    { handleOptions, leftOption, uploadImage}
) => {
    const [headingDisplay, setHeadingDisplay] = useState(false);
    return (
        <>
            {leftOption === 0 ? (
                <div>
                    <Tippy
                        placement="bottom"
                        content="Heading"
                        disabled={headingDisplay ? true : false}
                    >
                        <OptionRightButtons
                            onClick={(e) => {
                                setHeadingDisplay(!headingDisplay);
                            }}
                            style={{
                                position: "relative",
                            }}
                        >
                            <FaHeading />
                            {headingDisplay ? (
                                <HeadingsDiv>
                                    <h4 onClick={(e) => handleOptions(e, 0, 0)}>
                                        H1
                                    </h4>
                                    <h4 onClick={(e) => handleOptions(e, 0, 1)}>
                                        H2
                                    </h4>
                                    <h4 onClick={(e) => handleOptions(e, 0, 2)}>
                                        H3
                                    </h4>
                                </HeadingsDiv>
                            ) : null}
                        </OptionRightButtons>
                    </Tippy>
                    <Tippy
                        placement="bottom"
                        content="Bold text - Click here & put your cursor between stars"
                    >
                        <OptionRightButtons
                            onClick={(e) => handleOptions(e, 1)}
                        >
                            <FaBold />
                        </OptionRightButtons>
                    </Tippy>
                    <Tippy
                        placement="bottom"
                        content="Italic text - Click here & put your cursor between stars"
                    >
                        <OptionRightButtons
                            onClick={(e) => handleOptions(e, 2)}
                        >
                            <FaItalic />
                        </OptionRightButtons>
                    </Tippy>
                    <Tippy placement="bottom" content="Block quote">
                        <OptionRightButtons
                            onClick={(e) => handleOptions(e, 3)}
                        >
                            <FaQuoteLeft />
                        </OptionRightButtons>
                    </Tippy>
                    <Tippy
                        placement="bottom"
                        content="Code snippet - Click here & put your cursor between backtick"
                    >
                        <OptionRightButtons
                            onClick={(e) => handleOptions(e, 4)}
                        >
                            <FaCode />
                        </OptionRightButtons>
                    </Tippy>
                    <Tippy placement="bottom" content="Link">
                        <OptionRightButtons
                            onClick={(e) => handleOptions(e, 5)}
                        >
                            <ImLink />
                        </OptionRightButtons>
                    </Tippy>
                    <Tippy placement="bottom" content="Embed links">
                        <OptionRightButtons
                            onClick={(e) => handleOptions(e, 6)}
                        >
                            <BiCodeCurly />
                        </OptionRightButtons>
                    </Tippy>
                    <Tippy placement="bottom" content="Unordered list">
                        <OptionRightButtons
                            onClick={(e) => handleOptions(e, 7)}
                        >
                            <GoListUnordered />
                        </OptionRightButtons>
                    </Tippy>
                    <Tippy placement="bottom" content="Ordered list">
                        <OptionRightButtons
                            onClick={(e) => handleOptions(e, 8)}
                        >
                            <GoListOrdered />
                        </OptionRightButtons>
                    </Tippy>
                    <Tippy placement="bottom" content="Upload an image">
                        <OptionRightButtonsCamera>
                            <label>
                                <FiCamera />
                                <input
                                    onInput={(e) => uploadImage(e, "write")}
                                    type="file"
                                />
                            </label>
                        </OptionRightButtonsCamera>
                    </Tippy>
                    <Tippy placement="bottom" content="Markdown shortcuts">
                        <a
                            target="_blank"
                            href="https://daringfireball.net/projects/markdown/"
                        >
                            <OptionRightButtons>
                                <FaMarkdown />
                            </OptionRightButtons>
                        </a>
                    </Tippy>
                </div>
            ) : null}
        </>
    );
};

const OptionRightButtons = styled.button`
    border-radius: 0.5rem;
    border: 1px solid transparent;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    cursor: pointer;
    background-color: transparent;
    transition: all 0.2s ease;

    &:hover {
        background-color: #374151;
    }

    & > :nth-child(1) {
        width: 1rem;
        height: 1rem;
        color: #9ca3af;
    }
`;

const OptionRightButtonsCamera = styled.button`
    border-radius: 0.5rem;
    border: 1px solid transparent;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    cursor: pointer;
    background-color: transparent;
    transition: all 0.2s ease;

    &:hover {
        background-color: #374151;
    }

    & > label > :nth-child(1) {
        width: 1rem;
        height: 1rem;
        color: #9ca3af;
    }
    & > label > :nth-child(2) {
        visibility: hidden;
        width: 0px;
    }
`;

const HeadingsDiv = styled.div`
    width: 5rem;
    height: 7rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3),
        0 4px 6px -2px rgba(0, 0, 0, 0.2);
    margin-bottom: 1rem;
    z-index: 51;
    left: 0;
    top: 100%;
    position: absolute;
    text-align: left;
    padding: 1rem;
    background-color: #1f2937;
    border: 1px solid #374151;
    transition: all 0.2s ease;

    & > h4 {
        color: #f9fafb;
        margin: 0.5rem 0;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        transition: all 0.2s ease;
    }

    & > h4:hover {
        background-color: #374151;
        color: #fbbf24;
    }
`;