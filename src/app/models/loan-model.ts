export interface LoanModel {
    requestId?:number;
	borrowerId?:number;
	lenderId?:number;
	borrowerName?:string;
	lenderName?:string;
	loanAmount?:number;
	tenure?:number;
	loanReason?: string;
	requestStatus?: number;
	loanAcceptedDate?: string;
}
