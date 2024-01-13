namespace Balloon.Server;

public interface IDataModel<TSelf>
{
    public TSelf ToViewModel();
}