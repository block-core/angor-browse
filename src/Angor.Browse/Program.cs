using Angor.Browse;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Angor.Browse.BlockcoreDns;
using Angor.Browse.BlockcoreWallet;
using Angor.Browse.UniSatWallet;
using Blazored.LocalStorage;
using Blazored.SessionStorage;
using Polly.Bulkhead;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

builder.Services.AddBlockcoreWallet();

builder.Services.AddBlockcoreDns();

builder.Services.AddUniSatWallet();

builder.Services.AddAngorBrowseSharedServices();


builder.Services.AddBlazoredLocalStorage();
builder.Services.AddBlazoredSessionStorage();

builder.Services.AddBlockcoreDns();


await builder.Build().RunAsync();
