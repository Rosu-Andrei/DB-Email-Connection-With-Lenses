import {FieldContainerType} from "../fieldImpl/form.container.props";
import React from "react";

/**
 * Very simple, just like the FormContainer in cut2
 */
export const SimpleFormContainer: FieldContainerType = ({children}) => {
    return (
        <form>
            {children}
        </form>
    )
}