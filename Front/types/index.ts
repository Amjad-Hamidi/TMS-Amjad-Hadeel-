type Status='panding'|'confirmed'|'completed'
interface ISupervisor {
    id: string;
    name: string;
    email: string;
    phone: string;
    profileImage: string;
    rate:number
  }
  interface ICours{
    id: string,
    name:string,
    supervisorName:string,
    phone:string,
    rate: number,
    startDate: string,
    endDate: string,
    status:Status
  }
 interface ICertification{
     id:string,
     name:string,
     supervisorName:string,
     GarductionYear:string
     avarage:string
  }
  interface ICard{
      title:string,date:string,description:string,status:Status
  }
  interface IAssignments extends ICard{

  }
  export type {ISupervisor,Status,IAssignments,ICard,ICours,ICertification}