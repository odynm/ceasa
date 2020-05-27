/**
 * @format
 */

// prettier-ignore
import { AppRegistry } from 'react-native';
// prettier-ignore
import App from './App';
// prettier-ignore
import { name as CeasaName } from './app.json';

// prettier-ignore
import { YellowBox } from 'react-native';
// prettier-ignore
YellowBox.ignoreWarnings(["Deprecation in 'createStackNavigator': 'Header.HEIGHT' will"]);

// prettier-ignore
AppRegistry.registerComponent(CeasaName, () => App);
