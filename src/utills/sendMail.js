const transporter=require("../Config/mail")

const sendMail =async(to,subject,html)=>{
    try{
        await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to,
            subject,
            html
        })
        console.log("Email sent successfully")
    }catch(error){
        console.log(error.message)
    }

}

module.exports=sendMail