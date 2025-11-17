import axios from "axios";

const dialogServiceUrl = process.env.DIALOG_SERVICE_URL || "http://dialog-service:3001";

export const dialogServiceClient = {
    sendMessage: async (currentUserId: string, otherUserId: string, text: string) => {
        const url = `${dialogServiceUrl}/dialog/${otherUserId}/send`;

        return axios.post(url, { text }, {
            headers: {
                "x-user-id": currentUserId
            }
        });
    },

    getList: async (currentUserId: string, otherUserId: string) => {
        const url = `${dialogServiceUrl}/dialog/${otherUserId}/list`;

        return axios.get(url, {
            headers: {
                "x-user-id": currentUserId
            }
        });
    }
};
