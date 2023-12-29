﻿using Blockcore.Networks;

namespace Angor.Browse.Shared.Networks
{
    public static class Networks
    {
        public static NetworksSelector Bitcoin
        {
            get
            {
                return new NetworksSelector(() => new BitcoinMain(), () => new BitcoinTest(), () => null);
            }
        }

     
    }
}