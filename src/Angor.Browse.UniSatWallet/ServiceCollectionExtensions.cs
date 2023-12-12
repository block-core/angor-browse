using Microsoft.Extensions.DependencyInjection;
using Microsoft.JSInterop;

namespace Angor.Browse.UniSatWallet
{
    public static class ServiceCollectionExtensions
    {
        public static void AddUniSatWallet(this IServiceCollection services)
        {
            services.AddScoped<IUniSatWalletConnector>(sp => new UniSatWalletConnector(sp.GetRequiredService<IJSRuntime>()));
        }
    }
}
