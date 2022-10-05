/**
 * @description Parse the contents of the markdown version of the notification body
 * @param message the notification body we wish to parse
 * @returns 
 */
 export const FormatBody = (message: string) => {
    // firstly replace all new line content of the text with <br />
    // in order to parse it as HTML i.e "\n\n" => "<br /><br />"
    const parsedNewLine =  message.replace(/\n/g, "<br />");
    // remove leading slashes from text i.e \alex => alex
    const removedLeadingSlash = parsedNewLine.replace(/^\\/g, "");
  
    return removedLeadingSlash;
}
  