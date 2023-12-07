/*
    CODE.GS
*/
/** @OnlyCurrentDoc */
// Dev Ref: https://developers.google.com/apps-script/reference/spreadsheet

var loggingEnabled = true;
var editItem;

function startup() {
  try {  
    toast('Loading Vine config and menu','Vine Menu Status',3);

    var mainMenu = SpreadsheetApp.getUi().createMenu('🍃Vine');
    mainMenu.addItem("Bulk Input","showBulkInput");
    mainMenu.addItem("File Import","showImport");
    mainMenu.addSeparator();
    mainMenu.addItem("Future Features","showFutureFeatures");
    mainMenu.addSeparator();
    mainMenu.addItem("About","showAbout");
    mainMenu.addToUi();
    menuLoaded=true;

    toast('Vine config and menu loaded. Ready for takeoff','Vine Menu Status',3);
  } catch (err){
    var msg=`Error encountered.\n\n${err.message}\n\nStackTrace:${err.stack}`;
    console.log(msg);
    var ui = SpreadsheetApp.getUi();
    this.alert('Hardstop Error',msg,ui.ButtonSet.OK);      
  }
}

function regexKeyValue(key,value){
  var result;
  if (key.toLowerCase()==='baseamzurl'){
    result = value.match(/(http|https):\/\/[a-z0-9\-._~%]+/gm);
  } else if (key.toLowerCase()==='asin'){
    result = value.match(/([0-9]{10})|B0([A-Z0-9]{8})/g);    
  } else if (key.toLowerCase()==='ordernum'){
    result = value.match(/[\d]{3}-[\d]{7}-[\d]{7}|[\d]{17}/g)
  }
  if (result && result.length==1) return result[0];
  return result;
}
function alert(title,message,buttons){
  var ui = SpreadsheetApp.getUi();
  if (!buttons) buttons=ui.ButtonSet.OK;
  ui.alert(title, message, buttons);
}
function showAbout() {
  var widget = HtmlService.createTemplateFromFile("About.html").evaluate().setWidth(500).setHeight(650);
  SpreadsheetApp.getUi().showModalDialog(widget, " ");
}
function showFutureFeatures() {
  var widget = HtmlService.createHtmlOutputFromFile("FutureFeatures.html").setWidth(500).setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(widget, " ");
}
function showBulkInput() {
  var widget = HtmlService.createHtmlOutputFromFile("BulkInput.html").setWidth(1000).setHeight(1000);
  SpreadsheetApp.getUi().showModalDialog(widget, " ");
}
function showImport() {
  var widget = HtmlService.createHtmlOutputFromFile("Import.html").setWidth(1000).setHeight(1000);
  SpreadsheetApp.getUi().showModalDialog(widget, " ");
}

function setCellValue(sheet, row, column, value) {
  var cellAddress=Utils.a1Notation(row,column)
  console.log(`setting cellAddress ${sheet.getName()}::${cellAddress} to "${value}"`);
  var valueRange = sheet.getRange(cellAddress);
  valueRange.setValue(value);
}
function getAllASINS(){
  var sheet = getSheetByName("Data");
  var ASINS =[];
  var asinValues = sheet.getRange("F2:F").getValues();
  if (asinValues)
  {
    console.log(`ASINValues = ${JSON.stringify(asinValues)}`);
    asinValues = asinValues.map(function(asin){ if(asin[0] && asin[0].length>0) ASINS.push(asin[0]);}) ;
    console.log(`ASINValues = ${JSON.stringify(ASINS)}`);
    return ASINS;
  }
}
function getNamedRange(sheet, name) {
  console.log(`getNamedRange(sheet:${sheet.getName()},'${name}')`);
  if (!sheet) return;
  var namedRanges = sheet.getNamedRanges();
  for (var i = 0; i < namedRanges.length; i++) {
      if (namedRanges[i].getName().toLowerCase() == name.toLowerCase()) {
          return namedRanges[i].getRange();
      }
  }
  console.log(`     NO MATCHES`);
};

function a1Notation(row,col,fullHeight){
  this.log(`a1Notations(${row},${col},${fullHeight})`);
  var col = `${String.fromCharCode(col+64)}`;
  var a1= `${col}${row}`;
  if (fullHeight)
      return `${a1}:${col}`;
  else
      return a1;
}


function getCellValue(sheet, row, column) {
  var cellAddress = Utils.a1Notation(row,column)
  var valueRange = sheet.getRange(cellAddress);
  var value=valueRange.getValue();
  console.log(`getCellValue(sheet:${sheet.getName()},${row},${column})=${value}`);
  return value;
}
function getSheetByName(sheetName){
  return SpreadsheetApp.getActive().getSheetByName(sheetName); 
}

function getProductImageURL(asin) {
  return {ASIN:asin,
    src:"https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=" + asin + "&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL150_"};
}
function toast(message){
      SpreadsheetApp.getActiveSpreadsheet().toast(message);
  }
function toast(message,title){
      SpreadsheetApp.getActiveSpreadsheet().toast(message,title);
  }
function toast(message,title,timeoutSeconds){
      SpreadsheetApp.getActiveSpreadsheet().toast(message,title,timeoutSeconds);
  }
