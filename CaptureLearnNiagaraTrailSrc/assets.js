// assets.js
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

const signaturePath = RNFS.MainBundlePath + '/CaptureLearnNiagaraTrailAssets/CaptureLearnNiagaraTrail_signature.dat';
RNFS.readFile(signaturePath).then(data => {
}).catch(() => {
});
