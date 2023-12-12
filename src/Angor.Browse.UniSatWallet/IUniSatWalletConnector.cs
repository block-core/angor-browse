using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.Numerics;
using System.Threading.Tasks;

namespace Angor.Browse.UniSatWallet
{
	public interface IUniSatWalletConnector
    {

		ValueTask ConnectUniSatWallet();
		ValueTask DisposeAsync();
		ValueTask<bool> HasUniSatWallet();
		ValueTask<bool> IsSiteConnected();
		ValueTask<string> SignMessageAnyAccount(string value);
        ValueTask<UniSatWalletMessageOut?> GetWallet(string? key = null);
        ValueTask<string> GetSwapKey(string key, string walletId, string accountId, bool includePrivateKey);
        ValueTask<string> GetSwapSecret(string key, string walletId, string accountId, string message);
        ValueTask<string> SignMessageAnyAccountJson(string value);
		ValueTask<string> PaymentRequest(string network, string amount);
		ValueTask<string> DIDSupportedMethods();
		ValueTask<string> DIDRequest(string[] methods);
		ValueTask<string> SignMessage(string msg);
        ValueTask<UniSatWalletSendFundsOut?> SendCoins(UniSatWalletSendFunds data);
        ValueTask<UniSatWalletSwapCoinsOut?> SwapCoins(UniSatWalletSwapCoins data);
    }
}