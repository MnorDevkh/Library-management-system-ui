import api from "./api";

const contact = async(data) =>{
    return api.post(`/contact`,data);
}

const getContact = async(data) =>{
    return api.get(`/contact`,data);
}
const ContactServer = {contact,getContact};
export default ContactServer;