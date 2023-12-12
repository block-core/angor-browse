using Microsoft.Extensions.DependencyInjection;
using Microsoft.JSInterop;

namespace Angor.Browse.BlockcoreWallet
{
    public static class ServiceCollectionExtensions
    {
        public static void AddBlockcoreWallet(this IServiceCollection services)
        {
            services.AddScoped<IBlockcoreWalletConnector>(sp => new BlockcoreWalletConnector(sp.GetRequiredService<IJSRuntime>()));
        }
    }
}
