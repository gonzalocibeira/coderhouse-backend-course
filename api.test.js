import { expect } from "chai";
import supertest from "supertest";

let request;

describe("Ecommerce API test", () => {

    before(() => {request = supertest("http://localhost:3000")});

    describe("GET to /main", () => {
        it("should return a 200 code", async () => {
            const response = await request.get("/main")
            expect(response.status).to.eql(200);
        })
    });

    describe("POST to /add", () => {
        const testProd = {
            prodName: "test",
            username: "test"
        };
        it("should return a 200 code", async () => {
            const response = await request.post("/add").send(testProd);
            expect(response.status).to.eql(200);
        });
    })

});

