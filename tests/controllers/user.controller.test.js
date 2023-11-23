const {getAllUsers, updateUser} = require("../../Controllers/userController");
const { mockRequest, mockResponse } = require("../interceptor");
const User = require("../../Models/user");

const userTestPayoad = {
    name:"Dharma",
    password:"qwerty123",
    userStatus:"APPROVED",
    userTypes:"CUSTOMER",
    email:"dhamu@amazon.com",
    username:"dhamu"
}

describe("Find all users",()=>{

    it("happy Case", async ()=>{

        let req= mockRequest();
        let res= mockResponse();

        const userSpy = jest.spyOn(User,'find').mockReturnValue(Promise.resolve([userTestPayoad]));

        await getAllUsers(req,res);

        expect(userSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    email:"dhamu@amazon.com",
                    username:"dhamu"
                })
            ])
        )
    })


})

const userUpdatePayload={
    status:"APPROVED"
}

const userTestPayoadForUpdate = {
    name:"Dharma",
    password:"qwerty123",
    userStatus:"APPROVED",
    userTypes:"CUSTOMER",
    email:"dhamu@amazon.com",
    username:"dhamu",
    save:jest.fn()
}


const userTestPayoadForUpdatedValue = {
    name:"Dharma",
    password:"qwerty123",
    userStatus:"APPROVED",
    userTypes:"CUSTOMER",
    email:"dhamu@amazon.com",
    username:"dhamu",
    save:jest.fn()
}




describe("Update",()=>{    

    it("happy update Case", async ()=>{

        let req= mockRequest();
        let res= mockResponse();

        req.params = {id:1};
        req.body = userUpdatePayload; 

        jest.spyOn(userTestPayoadForUpdate, 'save').mockReturnValueOnce(Promise.resolve(userTestPayoadForUpdatedValue));

        const userSpy = jest.spyOn(User,'findOne').mockReturnValue(Promise.resolve(userTestPayoadForUpdate));
    
        await updateUser(req,res);

        expect(userSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                userStatus:"APPROVED"
            })
        )

    })

})
