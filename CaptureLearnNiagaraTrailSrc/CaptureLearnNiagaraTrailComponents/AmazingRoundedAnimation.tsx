import { View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const AmazingRoundedAnimation = () => {
  const dimensions = Dimensions.get('window');

  const swcandHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        /* From Uiverse.io by zanina-yassine */ 
        html, body {
          height: 100%;
          margin: 0;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          width: 250px;
          height: 250px;
          padding: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .cloud {
          width: 250px;
        }
        .front {
          padding-top: 45px;
          margin-left: 25px;
          display: inline;
          position: absolute;
          z-index: 11;
          animation: clouds 8s infinite;
          animation-timing-function: ease-in-out;
        }
        .back {
          margin-top: -30px;
          margin-left: 150px;
          z-index: 12;
          animation: clouds 12s infinite;
          animation-timing-function: ease-in-out;
          position: absolute;
        }
        .right-front {
          width: 45px;
          height: 45px;
          border-radius: 50% 50% 50% 0%;
          background-color: #4c9beb;
          display: inline-block;
          margin-left: -25px;
          z-index: 5;
        }
        .left-front {
          width: 65px;
          height: 65px;
          border-radius: 50% 50% 0% 50%;
          background-color: #4c9beb;
          display: inline-block;
          z-index: 5;
        }
        .right-back {
          width: 50px;
          height: 50px;
          border-radius: 50% 50% 50% 0%;
          background-color: #4c9beb;
          display: inline-block;
          margin-left: -20px;
          z-index: 5;
        }
        .left-back {
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 0% 50%;
          background-color: #4c9beb;
          display: inline-block;
          z-index: 5;
        }
        .sun {
          width: 120px;
          height: 120px;
          background: -webkit-linear-gradient(to right, #fcbb04, #fffc00);
          background: linear-gradient(to right, #fcbb04, #fffc00);
          border-radius: 60px;
          display: inline;
          position: absolute;
          left: 65px;
          top: 65px;
        }
        .sunshine {
          animation: sunshines 2s infinite;
        }
        @keyframes sunshines {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
        @keyframes clouds {
          0% {
            transform: translateX(15px);
          }
          50% {
            transform: translateX(0px);
          }
          100% {
            transform: translateX(15px);
          }
        }
      </style>
    </head>
    <body>
      <!-- From Uiverse.io by zanina-yassine --> 
      <div class="container">
        <div class="cloud front">
          <span class="left-front"></span>
          <span class="right-front"></span>
        </div>
        <span class="sun sunshine"></span>
        <span class="sun"></span>
        <div class="cloud back">
          <span class="left-back"></span>
          <span class="right-back"></span>
        </div>
      </div>
    </body>
    </html>
  `;

  return (
    <View style={{
      height: dimensions.height * 0.28,
      alignSelf: 'center',
      width: dimensions.width * 0.6,
      flex: 0,
    }}>
      <WebView
        startInLoadingState={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="compatibility"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scalesPageToFit={false}
        mediaPlaybackRequiresUserAction={false}
        source={{ html: swcandHtml }}
        style={{ flex: 1, backgroundColor: 'transparent' }}
        allowsInlineMediaPlayback={true}
        bounces={false}
        scrollEnabled={false}
      />
    </View>
  );
};

export default AmazingRoundedAnimation;