using Angor.Browse.UniSatWallet.Exceptions;
using Microsoft.JSInterop;
using System;
using System.Numerics;
using System.Reflection.Emit;
using System.Text.Json;
using System.Threading.Tasks;

namespace Angor.Browse.UniSatWallet
{
	// This class provides JavaScript functionality for UniSatWallet wrapped
	// in a .NET class for easy consumption. The associated JavaScript module is
	// loaded on demand when first needed.
	//
	// This class can be registered as scoped DI service and then injected into Blazor
	// components for use.

	public class UniSatWalletConnector : IAsyncDisposable, IUniSatWalletConnector
	{
		private readonly Lazy<Task<IJSObjectReference>> moduleTask;

		//public static event Func<Task>? ConnectEvent;
		//public static event Func<Task>? DisconnectEvent;

		public UniSatWalletConnector(IJSRuntime jsRuntime)
		{
			moduleTask = new(() => LoadScripts(jsRuntime).AsTask());
		}

		public ValueTask<IJSObjectReference> LoadScripts(IJSRuntime jsRuntime)
		{
			return jsRuntime.InvokeAsync<IJSObjectReference>("import", "./_content/Angor.Browse.UniSatWallet/UniSatWallet.js");
		}

		public async ValueTask ConnectUniSatWallet()
		{
			var module = await moduleTask.Value;
			try
			{
				await module.InvokeVoidAsync("checkUniSatWallet");
			}
			catch (Exception ex)
			{
				HandleExceptions(ex);
				throw;
			}
		}

		public async ValueTask<bool> HasUniSatWallet()
		{
			var module = await moduleTask.Value;
			try
			{
				return await module.InvokeAsync<bool>("hasUniSatWallet");
			}
			catch (Exception ex)
			{
				HandleExceptions(ex);
				throw;
			}
		}

		public async ValueTask<bool> IsSiteConnected()
		{
			var module = await moduleTask.Value;
			try
			{
				return await module.InvokeAsync<bool>("isSiteConnected");
			}
			catch (Exception ex)
			{
				HandleExceptions(ex);
				throw;
			}
		}

        public async ValueTask<UniSatWalletSendFundsOut?> SendCoins(UniSatWalletSendFunds data)
        {
            var input = JsonSerializer.Serialize(data);
            var module = await moduleTask.Value;
            try
            {
                var result = await module.InvokeAsync<string>("sendCoins", input);
                return JsonSerializer.Deserialize<UniSatWalletSendFundsOut?>(result);
            }
            catch (Exception ex)
            {
                HandleExceptions(ex);
                throw;
            }
        }

        public async ValueTask<UniSatWalletSwapCoinsOut?> SwapCoins(UniSatWalletSwapCoins data)
        {
            var input = JsonSerializer.Serialize(data);
            var module = await moduleTask.Value;
            try
            {
                var result = await module.InvokeAsync<string>("swapCoins", input);
                return JsonSerializer.Deserialize<UniSatWalletSwapCoinsOut?>(result);
            }
            catch (Exception ex)
            {
                HandleExceptions(ex);
                throw;
            }
        }

        public async ValueTask<UniSatWalletMessageOut?> GetWallet(string? key = null)
        {
            var module = await moduleTask.Value;
            try
            {
                var result = await module.InvokeAsync<string>("getWallet", key);
                return JsonSerializer.Deserialize<UniSatWalletMessageOut?>(result);

            }
            catch (Exception ex)
            {
                HandleExceptions(ex);
                throw;
            }
        }

        public async ValueTask<string> GetSwapKey(string key, string walletId, string accountId, bool includePrivateKey)
        {
            var module = await moduleTask.Value;
            try
            {
                return await module.InvokeAsync<string>("getSwapKey", key, walletId, accountId, includePrivateKey);
            }
            catch (Exception ex)
            {
                HandleExceptions(ex);
                throw;
            }
        }

        public async ValueTask<string> GetSwapSecret(string key, string walletId, string accountId, string message)
        {
            var module = await moduleTask.Value;
            try
            {
                return await module.InvokeAsync<string>("getSwapSecret", key, walletId, accountId, message);
            }
            catch (Exception ex)
            {
                HandleExceptions(ex);
                throw;
            }
        }

        public async ValueTask<string> SignMessageAnyAccount(string value)
		{
			var module = await moduleTask.Value;
			try
			{
				return await module.InvokeAsync<string>("signMessageAnyAccount", value);


			}
			catch (Exception ex)
			{
				HandleExceptions(ex);
				throw;
			}
		}

		public async ValueTask<string> SignMessageAnyAccountJson(string value)
		{
			var module = await moduleTask.Value;
			try
			{
				return await module.InvokeAsync<string>("signMessageAnyAccountJson", value);
			}
			catch (Exception ex)
			{
				HandleExceptions(ex);
				throw;
			}
		}

		public async ValueTask<string> PaymentRequest(string network, string amount)
		{
			var module = await moduleTask.Value;
			try
			{
				return await module.InvokeAsync<string>("paymentRequest", network, amount);
			}
			catch (Exception ex)
			{
				HandleExceptions(ex);
				throw;
			}
		}

		public async ValueTask<string> DIDSupportedMethods()
		{
			var module = await moduleTask.Value;
			try
			{
				return await module.InvokeAsync<string>("didSupportedMethods");
			}
			catch (Exception ex)
			{
				HandleExceptions(ex);
				throw;
			}
		}

		public async ValueTask<string> DIDRequest(string[] methods)
		{
			var module = await moduleTask.Value;
			try
			{
				return await module.InvokeAsync<string>("didRequest", methods);
			}
			catch (Exception ex)
			{
				HandleExceptions(ex);
				throw;
			}
		}

		public async ValueTask<string> SignMessage(string msg)
		{
			var module = await moduleTask.Value;
			try
			{
				return await module.InvokeAsync<string>("signMessage", msg);
			}
			catch (Exception ex)
			{
				HandleExceptions(ex);
				throw;
			}
		}

		public async ValueTask DisposeAsync()
		{
			if (moduleTask.IsValueCreated)
			{
				var module = await moduleTask.Value;
				await module.DisposeAsync();
			}
		}

		private void HandleExceptions(Exception ex)
		{
			switch (ex.Message)
			{
				case "NoUniSatWallet":
					throw new NoUniSatWalletException();
				case "UserDenied":
					throw new UserDeniedException();
			}
		}

	}
}
