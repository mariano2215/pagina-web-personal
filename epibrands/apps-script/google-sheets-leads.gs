/**
 * EPIBRANDS — Lead capture (Google Apps Script Web App)
 * --------------------------------------------------------
 * Recibe un POST con el lead del formulario de la landing
 * y lo guarda como fila en la hoja "Leads EPIBRANDS".
 *
 * Cómo publicar:
 *  1. Crear una hoja de Google Sheets.
 *  2. Crear una pestaña llamada exactamente: Leads EPIBRANDS
 *     (o cambiar SHEET_NAME abajo).
 *  3. Extensiones → Apps Script → pegar este código.
 *  4. Deploy → New deployment → Type: Web app.
 *     - Description: EPIBRANDS leads
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  5. Copiar la "Web app URL" y pegarla en:
 *     /epibrands/script.js  →  const SHEETS_ENDPOINT
 *
 * Nota: la landing envía con fetch(..., { mode: "no-cors" }),
 * por lo que el navegador no verá la respuesta. El lead se
 * guarda igual. WhatsApp queda como respaldo operativo.
 */

var SHEET_NAME = "Leads EPIBRANDS";

var HEADERS = [
  "Fecha",
  "Nombre",
  "Empresa",
  "Email",
  "WhatsApp",
  "País",
  "Tipo de negocio",
  "Plan de interés",
  "Necesidad",
  "Presupuesto",
  "Inicio",
  "Situación",
  "Fuente",
  "UTM Source",
  "UTM Medium",
  "UTM Campaign",
  "UTM Content",
  "UTM Term",
  "Estado",
  "Observaciones"
];

var ESTADOS = [
  "Nuevo",
  "Contactado",
  "Diagnóstico agendado",
  "Propuesta enviada",
  "Seguimiento",
  "Ganado",
  "Perdido",
  "No califica"
];

function doPost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      try { body = JSON.parse(e.postData.contents); }
      catch (err) { body = {}; }
    }
    // Fallback: form-encoded
    if (e && e.parameter && Object.keys(e.parameter).length) {
      Object.keys(e.parameter).forEach(function (k) {
        if (body[k] === undefined) body[k] = e.parameter[k];
      });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    ensureHeaders(sheet);
    ensureStatusValidation(sheet);

    var row = [
      new Date(),
      str(body.nombre),
      str(body.empresa),
      str(body.email),
      str(body.whatsapp),
      str(body.pais),
      str(body.tipoNegocio),
      str(body.planInteres),
      str(body.necesidad),
      str(body.presupuesto),
      str(body.inicio),
      str(body.situacion),
      str(body.fuente || "Landing EPIBRANDS"),
      str(body.utm_source),
      str(body.utm_medium),
      str(body.utm_campaign),
      str(body.utm_content),
      str(body.utm_term),
      "Nuevo",
      ""
    ];
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput("EPIBRANDS Leads endpoint OK")
    .setMimeType(ContentService.MimeType.TEXT);
}

function ensureHeaders(sheet) {
  var range = sheet.getRange(1, 1, 1, HEADERS.length);
  var current = range.getValues()[0];
  var needsHeaders = false;
  for (var i = 0; i < HEADERS.length; i++) {
    if (current[i] !== HEADERS[i]) { needsHeaders = true; break; }
  }
  if (needsHeaders) {
    range.setValues([HEADERS]);
    range.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
}

function ensureStatusValidation(sheet) {
  var lastRow = Math.max(sheet.getMaxRows(), 1000);
  var statusCol = HEADERS.indexOf("Estado") + 1;
  if (statusCol < 1) return;
  var range = sheet.getRange(2, statusCol, lastRow - 1, 1);
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(ESTADOS, true)
    .setAllowInvalid(false)
    .build();
  range.setDataValidation(rule);
}

function str(v) {
  if (v === null || v === undefined) return "";
  return String(v);
}
