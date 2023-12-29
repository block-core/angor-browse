using Angor.Browse.Shared.ProtocolNew.Scripts;
using Angor.Browse.Shared.ProtocolNew.TransactionBuilders;
using Angor.Browse.Shared.ProtocolNew;
using Angor.Browse.Shared.Services;
using Angor.Browse.Shared;
using Microsoft.Extensions.DependencyInjection;

namespace Angor.Browse.Shared
{
    public static class ServiceCollectionExtensions
    {
        public static void AddSharedServices(this IServiceCollection services)
        {
            //services.AddScoped<IBlockcoreDnsService, BlockcoreDnsService>();
            services.AddTransient<INetworkConfiguration, NetworkConfiguration>();
            services.AddTransient<IHdOperations, HdOperations>();

            services.AddTransient<IWalletOperations, WalletOperations>();
            services.AddScoped<IDerivationOperations, DerivationOperations>();

            services.AddScoped<IIndexerService, IndexerService>();
            services.AddScoped<IRelayService, RelayService>();
            services.AddScoped<ISignService, SignService>();
            services.AddScoped<INetworkService, NetworkService>();

            services.AddTransient<IFounderTransactionActions, FounderTransactionActions>();
            services.AddTransient<ISeederTransactionActions, SeederTransactionActions>();
            services.AddTransient<IInvestorTransactionActions, InvestorTransactionActions>();
            services.AddTransient<IInvestmentScriptBuilder, InvestmentScriptBuilder>();
            services.AddTransient<IProjectScriptsBuilder, ProjectScriptsBuilder>();
            services.AddTransient<ISpendingTransactionBuilder, SpendingTransactionBuilder>();
            services.AddTransient<IInvestmentTransactionBuilder, InvestmentTransactionBuilder>();
            services.AddTransient<ISeederScriptTreeBuilder, SeederScriptTreeBuilder>();
            services.AddTransient<ITaprootScriptBuilder, TaprootScriptBuilder>();

            services.AddSingleton<INostrCommunicationFactory, NostrCommunicationFactory>();
        }
    }
}
