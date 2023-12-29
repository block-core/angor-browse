using Blockcore.Consensus.ScriptInfo;

namespace Angor.Browse.Shared.ProtocolNew.Scripts;

public interface ISeederScriptTreeBuilder
{
    IEnumerable<Script> BuildSeederScriptTree(string investorKey, int seederThreshold, List<string> secretHashes);
}