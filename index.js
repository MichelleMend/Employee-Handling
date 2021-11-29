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
  createEmployee(name:String!,status:String!):Employee
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
            if (!statuses.includes(args.status)) {
                console.log("Must be a valid status - can't create this employee");
                return;
            }
            if (!args.name.trim().length) {
                console.log("Must be a name - can't create this employee");
                return;
            }
            const employee={
                id: idCounter.toString(),
                name: args.name,
                status: args.status,
            }
            idCounter++;
            employees.push(employee);
            return employee;
        },
        removeEmployee: (parent, args, context, info) => {
            const id = args.id.toLowerCase();
            const indexToDelete = employees.findIndex(employee=>employee.id.toLowerCase()===id);
            if(indexToDelete<0){
                console.log("User not found - can't remove employee");
                return false;
            }
            employees.splice(indexToDelete, 1);
            return true;
        },
        updateEmployeeStatus: (parent, args, context, info) => {
            if (!statuses.includes(args.status)) {
                console.log("Must be a valid status - can't update the status");
                return false;
            }
            const id = args.id.toLowerCase();
            const indexToUpdate = employees.findIndex(employee=>employee.id.toLowerCase()===id);
            if(indexToUpdate<0){
                console.log("User not found - can't update the status");
                return false;
            }
            employees[indexToUpdate].status = args.status;
            return true;
        },
    }
};
const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
});

