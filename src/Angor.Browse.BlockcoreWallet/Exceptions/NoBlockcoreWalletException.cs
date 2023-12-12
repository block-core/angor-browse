using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Angor.Browse.BlockcoreWallet.Exceptions
{
    public class NoBlockcoreWalletException : ApplicationException
    {
        public NoBlockcoreWalletException() : base("BlockcoreWallet is not installed.")
        {

        }
    }
}
