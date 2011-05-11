using System;
namespace Wrox
{
    public class ScopeTest
    {
        public ScopeTest()
        {
            for (int i = 0; i < 10; i++)
            {
                Console.WriteLine(i);
            }   // i goes out of scope here

            // We can declare a variable named i again, because
            // there is no other variable with that name in scope


            for (int i = 9; i >= 0; i--)
            {
                Console.WriteLine(i);

            }   // i goes out of scope here.
        } 

        public void errorMethod() {
            //int j = 20;
            //for (int i = 0; i < 10; i++)
            //{
            //    int j = 30;
            //    Console.WriteLine(j + i);
            //}
        }
    }
}