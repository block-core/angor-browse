using Angor.Browse.Shared.ProtocolNew.Scripts;
using Angor.Browse.Shared.ProtocolNew.TransactionBuilders;
using Angor.Browse.Shared.ProtocolNew;
using Angor.Browse.Shared.Services;
using Angor.Browse.Shared;
using Microsoft.Extensions.DependencyInjection;
using Angor.Browse.Storage;
using Angor.Browse.Services;

namespace Angor.Browse
{
    public static class ServiceCollectionExtensions
    {
        public static void AddAngorBrowseSharedServices(this IServiceCollection services)
        { 
            services.AddTransient<IClientStorage, ClientStorage>();
            services.AddTransient<INetworkStorage, ClientStorage>();
            services.AddTransient<IWalletStorage, WalletStorage>();
            services.AddScoped<ICacheStorage, LocalSessionStorage>();
            services.AddScoped<IClipboardService, ClipboardService>();

            services.AddSharedServices();

        }
    }
}
