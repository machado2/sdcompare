import React from "react";
import {Box} from "@chakra-ui/react";
import Select from "react-select";
import {Option} from "./SimpleTypes";


interface Props {
    promptOptions: Option[];
    handleSelectChange: (values: any) => void;
}

export const PromptSelector: React.FC<Props> = ({
                                                    promptOptions,
                                                    handleSelectChange
                                                }) => {
    return (<Box display="inline-block" width="25%" ml="10px">
            <Select
                autoFocus={true}
                placeholder="Select Prompt"
                isMulti={true}
                options={promptOptions as any}
                onChange={handleSelectChange}
                closeMenuOnSelect={false}
            />
        </Box>
    )
}