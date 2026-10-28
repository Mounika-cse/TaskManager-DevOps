class StaticVarTest{
 		static int count=0;
		StaticVarTest(){
				count++;
				//System.out.println(count);
		}
		public static void display(){
			
			System.out.println("present count value="+count);
		}
		public static void main(String args[]){

			StaticVarTest c1=new StaticVarTest();
			StaticVarTest c2=new StaticVarTest();
			StaticVarTest c3=new StaticVarTest();
			c1.display();
			c2.display();
			c3.display();

 }
}
