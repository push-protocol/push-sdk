/**
 * Define the types required to be used for the custom text parser
 */

/**
 * If you want to provide a custom regexp, this is the configuration to use.
 * -- For historical reasons, all regexps are processed as if they have the global flag set.
 * -- Use the nonExhaustiveModeMaxMatchCount property to match a limited number of matches.
 */
export interface CustomParseShape {
    pattern: RegExp;
    /**
     * Enables "non-exhaustive mode", where you can limit how many matches are found.
     *
     * If you want to match at most N things per-call to parse(), provide a positive number here.
     */
    renderText?: (matchingString: string, matches: string[]) => string;
    nonExhaustiveModeMaxMatchCount?: number;
    style: unknown
}

export interface ParseMarkdownTextProps{
    text: string,
    patterns?: CustomParseShape[]
}

export interface ParsedTextProps {
    patterns: CustomParseShape[];
}