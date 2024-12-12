import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>

                {/* <link rel="stylesheet" href="/icons/all.min.css" /> */}
                <link rel="stylesheet" href="/asset/fontawesome/css/all.min.css" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
                /> 
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}