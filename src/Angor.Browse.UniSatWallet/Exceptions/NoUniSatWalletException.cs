using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Angor.Browse.UniSatWallet.Exceptions
{
    public class NoUniSatWalletException : ApplicationException
    {
        public NoUniSatWalletException() : base("UniSat Wallet is not installed.")
        {

        }
    }
}
