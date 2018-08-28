import { createMuiTheme } from '@material-ui/core/styles';
import orange from '@material-ui/core/colors/orange';

const theme = createMuiTheme({
  typography: {
    fontFamily: '"Open Sans", sans-serif',
  },
  palette: {
    primary: orange,
    text: {
      primary: "rgba(255, 255, 255, 0.95)",
      secondary: "rgba(255, 255, 255, 0.75)",
      disabled: "rgba(255, 255, 255, 0.38)",
      hint: "rgba(255, 255, 255, 0.38)",
    },
    background: {
      paper: "#ff8236",
      default: "#ff8236",
    }
  },
  overrides: {

  },
});

export default theme;
