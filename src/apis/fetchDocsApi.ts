import { google } from "googleapis";
import gapiAuth from "./gapiAuth";
import { DOC_ALIGNMENT } from "../constants";

export default async function fetchDocsApi() {
    const docs = google.docs({ version: 'v1', auth: gapiAuth() });

    const response = await docs.documents.get({
        documentId: process.env.GOOGLE_DOCS_ID
    });

    const content = response.data.body?.content;
    if (!content) {
        throw new Error('Failed to load document...');
    }

    // Table
    const text = content?.reduce((accumulator, currentValue) => {
        const paragraph = currentValue!!.paragraph;
        const tableRows = currentValue!!.table?.tableRows;
        if (tableRows) {
            return accumulator += `<table style="text-align: center; border: 1px solid black; border-collapse: collapse;">${tableRows.reduce((a1, c1) => {
                // Rows
                return a1 += `<tr>
                    ${c1.tableCells!!.reduce((a2, c2) => {
                        const cellData = c2.content!!.reduce((a3, c3) => {
                            // Cell content
                            return a3 += c3.paragraph?.elements?.reduce((a4, c4) => {
                                // Cell element
                                const textRun = c4.textRun!!;
                                const textStyle = textRun?.textStyle;
                                let content = textRun?.content || "";
                                content = styleText(textStyle, content);
                                return a4 += content;
                            }, '');
                        }, '');

                        const colspan = c2.tableCellStyle?.columnSpan;
                        // Cell
                        return cellData.trim() ? a2 += `<td ${colspan ? `colspan="${colspan}"` : ''} style="border: 1px solid black; border-collapse: collapse; padding: 0 1rem">
                            ${cellData}
                        </td>` : a2;
                    }, '')}
                <tr>`
            }, '')}</table>`;
        }
        if (!paragraph) {
            return accumulator;
        }
        const alignment = paragraph.paragraphStyle?.alignment;
        const content = paragraph.elements!!.reduce((acc, currVal) => {
            // Image
            const inlineObjectId = currVal?.inlineObjectElement?.inlineObjectId;
            if (inlineObjectId && response.data.inlineObjects!![inlineObjectId]) {
                const inlineObject = response.data.inlineObjects!![inlineObjectId];
                return acc += `<img src="${inlineObject.inlineObjectProperties?.embeddedObject?.imageProperties?.contentUri}" alt="Unable to load image"/>`;
            }
            // Text
            const textRun = currVal.textRun!!;
            const textStyle = textRun?.textStyle;
            let content = textRun?.content || "";
            content = styleText(textStyle, content);
            return acc += content;
        }, '');

        let newContent = content;
        switch (alignment) {
            case DOC_ALIGNMENT.CENTER: {
                newContent = `<p style="text-align: center;">${content}</p>`
                break;
            }
            case DOC_ALIGNMENT.END: {
                newContent = `<p style="text-align: right;">${content}</p>`
                break;
            }
        }
        return accumulator += newContent;
    }, '');
    
    return text;
}

function styleText(textStyle, content: string) {
    if (textStyle?.bold) {
        content = content.bold();
    }
    if (textStyle?.strikethrough) {
        content = content.strike();
    }
    if (textStyle?.italic) {
        content = content.italics();
    }
    if (textStyle?.underline) {
        content = `<u>${content}</u>`;
    }
    return content;
}