import axios from 'axios'
function createBodyPayload(reqBody){
    const {orderid,email,payment_method,total} = reqBody
    const result = {
        'payment_type':'gopay',
        'transaction_details':{
            'order_id':orderid,
            'gross_amount':total
        },
        'customer_details': {
            'email': email,
        },
    }
    if(payment_method === 'alfamart'){
        result.payment_type = 'cstore'
        result.cstore = {
            "store":'alfamart',
            "message":"baju",
            "alfamart_free_text_1": "1st row of receipt,",
            "alfamart_free_text_2": "This is the 2nd row,",
            "alfamart_free_text_3": "3rd row. The end."
        }
    }
    return result
}
export async function transaction(req,res){
    try { 
        const payload = createBodyPayload(req.body)
        const {data} = await axios({
            url:'https://api.sandbox.midtrans.com/v2/charge',
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization':'Basic <Base64Encode(yout-server-key)>'
            },
            data:JSON.stringify(payload)
        })
        console.log(data)
       return res.json(data)
    } catch (error) {
        
    }

}