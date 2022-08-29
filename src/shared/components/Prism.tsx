import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/dracula';

const Prism = (props: any) => {
  return (
    <Highlight {...defaultProps} theme={theme} code={props.code} language={props.language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div className="m-t-15">
          <pre className={className} style={style}>
            <code className="language-markup">
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        </div>
      )}
    </Highlight>
  );
};

export default Prism;
