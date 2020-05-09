// @flow

import color from "color";
import { Platform, Dimensions, PixelRatio } from "react-native";

const hours = new Date().getHours()
let isDayTime = hours > 6 && hours < 18
isDayTime = true;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const platformStyle = undefined;
const isIphoneX =
  platform === "ios" && (deviceHeight === 812 || deviceWidth === 812 || deviceHeight === 896 || deviceWidth === 896);

export default {
  platformStyle,
  platform,

  //Container
  containerBgColor: isDayTime ? "rgba(249, 244, 240, 1.0)": "#222B45",
  mainColor:"#006F51",
  textPrimary: isDayTime ? "#2574a9": "#FFF",
  textPrimary9:"#154d2e",
  textSecondary: isDayTime ? "#FFF": "#222B45",
  textTrinary: isDayTime ? "#222B45": "#FFF",
  textInput:"#2c3e50",
  textRedflat:"#eb4d4b",
  textUnit:"#2e3131",
  grayScale: isDayTime ? "#bdc3c7": "#FFF",
  bgPrimary: isDayTime ? "#FFF": "#222B45",
  borderPrimary: isDayTime ? "#FFF": "#222B45",
  borderInput: isDayTime ? "#ecf0f1": "#FFF",
  borderGreen:"#006F51",
  backgroundInput:"#ecf0f1",
  barColor:"#297AB1",
  shadowColor:"rgba(0,0,0, .4)",
  bgButtonPrimary: "rgba(236, 240, 241,0.7)",
  bgButtonSecondary:"#013243",
  inactiveColor:"rgba(192, 57, 43,0.3)",
  headerBGPrimary:isDayTime ? "#FFF": "#222B45",
  headerTextPrimary:"#006F51",
  b2cColorPrimary:"#2980b9",
  b2bColorPrimary:"#c0392b",
  rrColorPrimary:"#036635",
  errorPrimary:"#c0392b",
  restingColor:"#f4d03f",
  orangePrimary:"#e67e22",
  leaveColor:"#e74c3c",
  

  //Accordion
  headerStyle: "#edebed",
  iconStyle: "#000",
  contentStyle: "#f5f4f5",
  expandedIconStyle: "#000",
  accordionBorderColor: "#d3d3d3",

  //Android
  androidRipple: true,
  androidRippleColor: "rgba(256, 256, 256, 0.3)",
  androidRippleColorDark: "rgba(0, 0, 0, 0.15)",
  btnUppercaseAndroidText: true,

  // Badge
  badgeBg: "#ED1727",
  badgeColor: isDayTime ? "#FFF": "#222B45",
  badgePadding: platform === "ios" ? 3 : 0,

  // Button
  btnFontFamily: platform === "ios" ? "System" : "Roboto",
  btnDisabledBg: "#b5b5b5",
  buttonPadding: 6,
  get btnPrimaryBg() {
    return this.brandPrimary;
  },
  get btnPrimaryColor() {
    return this.inverseTextColor;
  },
  get btnInfoBg() {
    return this.brandInfo;
  },
  get btnInfoColor() {
    return this.inverseTextColor;
  },
  get btnSuccessBg() {
    return this.brandSuccess;
  },
  get btnSuccessColor() {
    return this.inverseTextColor;
  },
  get btnDangerBg() {
    return this.brandDanger;
  },
  get btnDangerColor() {
    return this.inverseTextColor;
  },
  get btnWarningBg() {
    return this.brandWarning;
  },
  get btnWarningColor() {
    return this.inverseTextColor;
  },
  get btnTextSize() {
    return platform === "ios" ? this.fontSizeBase * 1.1 : this.fontSizeBase - 1;
  },
  get btnTextSizeLarge() {
    return this.fontSizeBase * 1.5;
  },
  get btnTextSizeSmall() {
    return this.fontSizeBase * 0.8;
  },
  get borderRadiusLarge() {
    return this.fontSizeBase * 3.8;
  },
  get iconSizeLarge() {
    return this.iconFontSize * 1.5;
  },
  get iconSizeSmall() {
    return this.iconFontSize * 0.6;
  },

  // Card
  cardDefaultBg: isDayTime ? "#FFF": "#222B45",
  cardBorderColor: isDayTime ? "#FFF": "#222B45",
  cardBorderRadius: 2,
  cardItemPadding: platform === "ios" ? 10 : 12,

  // CheckBox
  CheckboxRadius: platform === "ios" ? 13 : 0,
  CheckboxBorderWidth: platform === "ios" ? 1 : 2,
  CheckboxPaddingLeft: platform === "ios" ? 4 : 2,
  CheckboxPaddingBottom: platform === "ios" ? 0 : 5,
  CheckboxIconSize: platform === "ios" ? 21 : 16,
  CheckboxIconMarginTop: platform === "ios" ? undefined : 1,
  CheckboxFontSize: platform === "ios" ? 23 / 0.9 : 17,
  checkboxBgColor: "#039BE5",
  checkboxSize: 20,
  checkboxTickColor: isDayTime ? "#FFF": "#222B45",

  // Color
  brandPrimary: platform === "ios" ? "#007aff" : "#007aff",
  brandInfo: "#62B1F6",
  brandSuccess: "#5cb85c",
  brandDanger: "#d9534f",
  brandWarning: "#f0ad4e",
  brandDark: isDayTime ? "#222B45": "#FFF",
  brandLight: "#f4f4f4",

  //Date Picker
  datePickerTextColor: isDayTime ? "#222B45": "#FFF",
  datePickerBg: "transparent",

  // Font
  DefaultFontSize: 16,
  fontFamily: platform === "ios" ? "System" : "Roboto",
  fontSizeBase: 15,
  get fontSizeH1() {
    return this.fontSizeBase * 1.8;
  },
  get fontSizeH2() {
    return this.fontSizeBase * 1.6;
  },
  get fontSizeH3() {
    return this.fontSizeBase * 1.4;
  },

  // Footer
  footerHeight: 55,
  footerDefaultBg: isDayTime ? "#FFF": "#222B45",
  footerPaddingBottom: 0,

  // FooterTab
  tabBarTextColor: isDayTime ? "#737373": "#FFF",
  tabBarTextSize: platform === "ios" ? 14 : 11,
  activeTab: platform === "ios" ? "#006F51" : "#006F51",
  sTabBarActiveTextColor: "#007aff",
  tabBarActiveTextColor: platform === "ios" ? "#006F51" : "#006F51",
  tabActiveBgColor: platform === "ios" ? "#FFFFFF" : "#FFFFFF",

  // Header
  toolbarBtnColor: platform === "ios" ? "#007aff" : "#007aff",
  toolbarDefaultBg: platform === "ios" ? "#F8F8F8" : "#F8F8F8",
  toolbarHeight: platform === "ios" ? 64 : 56,
  toolbarSearchIconSize: platform === "ios" ? 20 : 23,
  toolbarInputColor: platform === "ios" ? "#CECDD2" : "#CECDD2",
  searchBarHeight: platform === "ios" ? 30 : 40,
  searchBarInputHeight: platform === "ios" ? 30 : 50,
  toolbarBtnTextColor: platform === "ios" ? "#007aff" : "#007aff",
  iosStatusbar: "dark-content",
  toolbarDefaultBorder: isDayTime ? "#FFF": "#222B45",
  get statusBarColor() {
    return color(this.toolbarDefaultBg)
      .darken(0.2)
      .hex();
  },
  get darkenHeader() {
    return color(this.tabBgColor)
      .darken(0.03)
      .hex();
  },

  // Icon
  iconFamily: "Ionicons",
  iconFontSize: platform === "ios" ? 30 : 28,
  iconHeaderSize: platform === "ios" ? 33 : 24,

  // InputGroup
  inputFontSize: 17,
  inputBorderColor: "#D9D5DC",
  inputSuccessBorderColor: "#2b8339",
  inputErrorBorderColor: "#ed2f2f",
  inputHeightBase: 50,
  get inputColor() {
    return this.textColor;
  },
  get inputColorPlaceholder() {
    return "#575757";
  },

  // Line Height
  btnLineHeight: 19,
  lineHeightH1: 32,
  lineHeightH2: 27,
  lineHeightH3: 22,
  lineHeight: platform === "ios" ? 20 : 24,

  // List
  listBg: "transparent",
  listBorderColor: "#c9c9c9",
  listDividerBg: "#f4f4f4",
  listBtnUnderlayColor: "#DDD",
  listItemPadding: platform === "ios" ? 10 : 12,
  listNoteColor: "#808080",
  listNoteSize: 13,
  listItemSelected: platform === "ios" ? "#007aff" : "#007aff",

  // Progress Bar
  defaultProgressColor: "#E4202D",
  inverseProgressColor: "#1A191B",

  // Radio Button
  radioBtnSize: platform === "ios" ? 25 : 23,
  radioSelectedColorAndroid: "#006F51",
  radioBtnLineHeight: platform === "ios" ? 29 : 24,
  get radioColor() {
    return this.brandPrimary;
  },

  // Segment
  segmentBackgroundColor: platform === "ios" ? "#F8F8F8" : "#F8F8F8",
  segmentActiveBackgroundColor: platform === "ios" ? "#007aff" : "#007aff",
  segmentTextColor: platform === "ios" ? "#007aff" : "#007aff",
  segmentActiveTextColor: isDayTime ? "#FFF": "#222B45",
  segmentBorderColor: platform === "ios" ? "#007aff" : "#007aff",
  segmentBorderColorMain: platform === "ios" ? "#a7a6ab" : "#a7a6ab",

  // Spinner
  defaultSpinnerColor: "#006F51",
  inverseSpinnerColor: "#006F51",

  // Tab
  tabDefaultBg: isDayTime ? "#FFF": "#222B45",
  topTabBarTextColor: platform === "ios" ? "#6b6b6b" : "#6b6b6b",
  topTabBarActiveTextColor: platform === "ios" ? "#006F51" : "#006F51",
  topTabBarBorderColor: platform === "ios" ? "#a7a6ab" : "#a7a6ab",
  topTabBarActiveBorderColor: platform === "ios" ? "#006F51" : "#006F51",

  // Tabs
  tabBgColor: "#F8F8F8",
  tabFontSize: 15,

  // Text
  textColor:isDayTime ? "#222B45": "#FFF",
  inverseTextColor: isDayTime ? "#FFF": "#222B45",
  noteFontSize: 14,
  get defaultTextColor() {
    return this.textColor;
  },

  // Title
  titleFontfamily: platform === "ios" ? "System" : "Roboto",
  titleFontSize: platform === "ios" ? 17 : 19,
  subTitleFontSize: platform === "ios" ? 11 : 14,
  subtitleColor: isDayTime ? "#222B45": "#FFF",
  titleFontColor: isDayTime ? "#222B45": "#FFF",

  // Other
  borderRadiusBase: platform === "ios" ? 5 : 2,
  borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
  contentPadding: 10,
  dropdownLinkColor: "#414142",
  inputLineHeight: 24,
  deviceWidth,
  deviceHeight,
  isIphoneX,
  inputGroupRoundedBorderRadius: 30,

  //iPhoneX SafeArea
  Inset: {
    portrait: {
      topInset: 24,
      leftInset: 0,
      rightInset: 0,
      bottomInset: 34
    },
    landscape: {
      topInset: 0,
      leftInset: 44,
      rightInset: 44,
      bottomInset: 21
    }
  }
};
