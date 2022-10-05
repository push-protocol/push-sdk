// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from 'react';
import * as PropTypes from "prop-types";
import HTMLReactParser from 'html-react-parser';

import { ParsedTextProps } from './customParser.types';
import TextExtraction from './lib/TextExtraction';
import { FormatBody } from '../../utilities';

import DEFAULT_PATTERNS from './defaultPatterns';

const ParseMarkDown: React.FC<ParsedTextProps> = (props) => {
    const { patterns, ...remainder } = { ...props };

    function getPatterns(){
      return DEFAULT_PATTERNS.concat(patterns)
    }
    function getParsedText() {
        if (!props.patterns) {
          return props.children;
        }
        if (typeof props.children !== 'string') {
          return props.children;
        }
    
        const textExtraction = new TextExtraction(
          props.children,
          getPatterns(), 
        );
    
        return textExtraction.parse().map((
          props: { style: React.CSSProperties, children: string, childrenProps: unknown },
          index:number
        ) => {
          const { style, children } = props;
          return (
            <span
              key={`parsedText-${index}`}
              style={{ ...style }}
              {...props.childrenProps}
            >
              {
                HTMLReactParser(FormatBody(children))
              }
            </span>
          );
        });
      }

    return (
        <div {...remainder}>
            {getParsedText()}
      </div>
    )
};

// ================= Define default props
ParseMarkDown.propTypes = {
  patterns: PropTypes.array.isRequired,
};

export default ParseMarkDown