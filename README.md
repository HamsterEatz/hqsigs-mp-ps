# Manpower Branch Parade State Webpage

> ### Note: This is made only for personnels within `Stagmont Camp HQ Signals Command & Systems Manpower Branch` only!

> ### Application is currently live!

This project aims to simplify the workflow for POCs, when tasked to submit parade state on roll call.

#### Documentation

> # Currently live at: https://hqsigs-mp-ps.vercel.app/

> ## Google Sheets Apps Script

The following snippet allows a Telegram bot to send a text to either a channel or direct message to notify the POC that a change has been made, given that the day and time conditions are met (the condition rationale is to notify the POC exactly what changes has been made, after the parade state has been submitted).

### Code.gs
```
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHANNEL_ID;

function onEdit(e){
  const date = new Date();
  const day = date.getDay();
  const hours = date.getHours();

  const range = e.range;
  const sheetId = range.getSheet().getSheetId();
  const colIndex = range.getColumn();
  const isFirstParade = colIndex % 2 === 1;
  const dayEdited = Math.floor((colIndex - (isFirstParade ? 3 : 4)) / 2);

  if ((day > 0 && day < 6) && (hours === 7 || hours === 8 || hours === 16) && dayEdited === day && sheetId === 0123456789) {
    const source = e.source;
    const sheetName = range.getSheet().getName();
    const rowIndex = range.getRow();
    const rankAndNameRange = source.getSheetByName(sheetName).getRange(`B${rowIndex}:C${rowIndex}`);
    const name = rankAndNameRange.getCell(1,1).getValues()[0][0];
    const rank = rankAndNameRange.getCell(1,2).getValues()[0][0];

    const oldValue = e.oldValue;
    const newValue = range.getCell(1,1).getValue();
    const text = `<b>EDIT DETECTED:\n${rank} ${name}</b> has changed his ${isFirstParade ? 'First' : 'Last'} parade state from <b>${oldValue ? oldValue : "UNACCOUNTED"} → ${newValue ? newValue : "UNACCOUNTED"}</b>`;
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${text}&parse_mode=HTML`;
    return UrlFetchApp.fetch(encodeURI(url));
  }
  return;
}
```

#### Development
The webpage is created using TypeScript Next.js and googleapis.

Semantic commit messages also help with better workflows.

| Type     | Description                                                        |
| -------- | ------------------------------------------------------------------ |
| feat     | New feature for the user, not a new feature for build script       |
| fix      | Bug fix for the user, not a fix to a build script                  |
| docs     | Changes to the documentation                                       |
| style    | Formatting, missing semi colons, etc; no production code change    |
| refactor | Refactoring production code, eg. renaming a variable               |
| test     | Adding missing tests, refactoring tests; no production code change |
| chore    | Updating grunt tasks etc; no production code change                |

This project is open-sourced!