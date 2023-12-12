using Microsoft.Extensions.DependencyInjection;

namespace Angor.Browse.BlockcoreDns
{
    public static class ServiceCollectionExtensions
    {
        public static void AddBlockcoreDns(this IServiceCollection services)
        {
            services.AddScoped<IBlockcoreDnsService, BlockcoreDnsService>();
        }
    }
}
