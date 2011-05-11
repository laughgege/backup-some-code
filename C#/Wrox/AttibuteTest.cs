using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Wrox
{
    class AttibuteTest
    {
        public string attr { get; set; }
        //public string errorAttr { set; }
        public string rightAttr { set; private get; }
    }
}
