const {ApolloServer, gql} = require('apollo-server');
const typeDefs = gql`

  type Employee{
  id:String!
  name:String!
  status: String!
  }
  
  type Query {
    employees: [Employee]!
  }
  
  type Mutation {
  createEmployee(name:String!,status:String!):Employee!
  getEmployees:[Employee!]!
  updateEmployeeStatus(id:String!,status:String!):Boolean!
  removeEmployee(id:String!):Boolean! 
  }  
`;
let idCounter = 1; // Sequence - incrementing the id
const employees = [];
const statuses = ["Working", "OnVacation", "LaunchTime", "BusinessTrip"];
const resolvers = {
    Query: {
        employees: () => employees
    },
    Mutation: {
        createEmployee: (parent, args, context, info) => {
            const employee = {
                id: "",
                name: "",
                status: "",
            }
            if (!statuses.includes(args.status)) {
                console.log("Must be a valid status - can't create this employee");
                return employee;
            }
            if (!args.name) {
                console.log("Must be a name - can't create this employee");
                return employee;
            }
            employee.id = idCounter.toString();
            employee.name = args.name;
            employee.status = args.status;
            idCounter++;
            employees.push(employee);
            return employee;
        },
        removeEmployee: (parent, args, context, info) => {
            for (let i = 0; i < employees.length; i++) {
                if (employees[i].id.toLowerCase() === args.id.toLowerCase()) {
                    employees.splice(i, 1);
                    return true;
                }
            }
            console.log("User not found - can't remove employee");
            return false;
        },
        updateEmployeeStatus: (parent, args, context, info) => {
            if (!statuses.includes(args.status)) {
                console.log("Must be a valid status - can't update the status");
                return false;
            }
            for (let i = 0; i < employees.length; i++) {
                if (employees[i].id.toLowerCase() === args.id.toLowerCase()) {
                    if(employees[i].status === args.status){
                        console.log("Same status - no need to update");
                        return false;
                    }
                    employees[i].status = args.status;
                    return true;
                }
            }
            console.log("User not found - can't update the status");
            return false;
        },
        getEmployees: () => {   //Not really necessary - does the same as query
            return employees;
        }
    }
};
const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
});

