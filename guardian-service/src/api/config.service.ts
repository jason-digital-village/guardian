import { readJSON, writeJSON } from 'fs-extra';
import { IAddressBookConfig, MessageAPI } from 'interfaces';
import path from 'path';
import { HederaHelper } from 'vc-modules';

export const readConfig = async function (): Promise<any> {
    const fileName = path.join(process.cwd(), 'config.json');
    let fileContent: any;
    try {
        fileContent = await readJSON(fileName);
    } catch (error) {
        throw ('you need to create a file \'config.json\'');
    }
    if (!fileContent.hasOwnProperty('OPERATOR_ID') || fileContent['OPERATOR_ID'].length < 5) {
        throw ('You need to fill OPERATOR_ID field in config.json file');
    }
    if (!fileContent.hasOwnProperty('OPERATOR_KEY') || fileContent['OPERATOR_KEY'].length < 5) {
        throw ('You need to fill OPERATOR_KEY field in config.json file');
    }
    let regenerate = false;
    if (!fileContent.hasOwnProperty('ADDRESS_BOOK')) {
        regenerate = true;
    }
    if (!fileContent.hasOwnProperty('VC_TOPIC_ID')) {
        regenerate = true;
    }
    if (!fileContent.hasOwnProperty('DID_TOPIC_ID')) {
        regenerate = true;
    }
    if (regenerate) {
        const net = await HederaHelper.newNetwork(
            fileContent['OPERATOR_ID'],
            fileContent['OPERATOR_KEY'],
            '', '', '', ''
        );
        fileContent['ADDRESS_BOOK'] = net.addressBookId;
        fileContent['VC_TOPIC_ID'] = net.vcTopicId;
        fileContent['DID_TOPIC_ID'] = net.didTopicId;
        await writeJSON(fileName, fileContent);
    }
    return fileContent;
}

export const configAPI = async function (
    channel: any,
    fileContent: any
): Promise<void> {
    channel.response(MessageAPI.GET_ROOT_ADDRESS_BOOK, async (msg, res) => {
        const config: IAddressBookConfig = {
            owner: null,
            addressBook: fileContent['ADDRESS_BOOK'],
            vcTopic: fileContent['VC_TOPIC_ID'],
            didTopic: fileContent['DID_TOPIC_ID']
        }
        res.send(config);
    });
}