using System;

namespace Wrox
{
    public enum TimeOfDay
    { 
        Morning = 0,
        Afternoon = 1,
        Evening = 2
    }
    class enumExample
    {
    
        public static void WriteGreeting(TimeOfDay day)
        {
            switch (day)
            { 
                case TimeOfDay.Morning:
                    Console.WriteLine("Hello Morning!");
                    break;
                case TimeOfDay.Afternoon:
                    Console.WriteLine("Hello Afternoon!");
                    break;

                case TimeOfDay.Evening:
                    Console.WriteLine("Hello Evening!");
                    break;
                default:
                    Console.WriteLine("Hello!");
                    break;
            }
        }

        public static void RunTest() 
        {
            TimeOfDay day = TimeOfDay.Afternoon;
            Console.WriteLine(day);
            Console.WriteLine((int)day);

            TimeOfDay time = (TimeOfDay)Enum.Parse(typeof(TimeOfDay), "evening", true);
            Console.WriteLine((int)time);
        }
    }
}
