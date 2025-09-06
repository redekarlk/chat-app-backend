import convoModel from "../models/conversation-model.js";
import messageModel from "../models/message-model.js";



export const sendMsg = async (req, res) => {
    const { userId: senderId, conversationId, text } = req.body;

    try {
        // const senderId = req.user.id;

        const message = await messageModel.create({
            // conversationId,
            conversation: conversationId,
            sender: senderId,
            text,
        });

        // update lastMessage in conversation
        await convoModel.findByIdAndUpdate(conversationId, {
            lastMessage: message._id,
            updatedAt: new Date()
        });

        res.json({ success: true, message });
    } catch (err) {
        // console.log(err)
        res.json({ success: false, message: err.message });
    }
};


export const getMsgOfConvo = async (req, res) => {
    try {
        const messages = await messageModel.find({
            conversation: req.params.conversationId,
        }).populate("sender", "name email");

        // console.log("called")
        res.json({ success: true, messages });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};