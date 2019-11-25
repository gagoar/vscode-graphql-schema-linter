import { DecorationRenderOptions, OverviewRulerLane } from 'vscode';

export const decorationTypeOptions: DecorationRenderOptions = {
  borderWidth: '1px',
  borderStyle: 'solid',
  overviewRulerColor: 'blue',
  overviewRulerLane: OverviewRulerLane.Right,
  light: { // used in light color themes
    borderColor: 'darkblue'
  },
  dark: { // used in dark color themes
    borderColor: 'lightblue'
  },
  textDecoration: 'wavy underline'
}