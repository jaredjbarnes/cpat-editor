import { useSignalValue } from '@tcn/state';
import { PendingFileCreation } from './pending_file_creation.tsx';
import { DirectoryItemProps, DirectoryItem } from './directory_item.tsx';
import { FileItem } from './file_item.tsx';
import { PendingDirectoryCreation } from './pending_directory_creation.tsx';

export function RootDirectory({ directory, presenter }: DirectoryItemProps) {
  const pendingFileCreation = useSignalValue(presenter.pendingFileCreationBroadcast);
  const pendingDirectoryCreation = useSignalValue(
    presenter.pendingDirectoryCreationBroadcast
  );

  const children = directory.items.map((i, index) => {
    if (i.type === 'directory') {
      return <DirectoryItem key={index} directory={i} presenter={presenter} />;
    } else {
      return <FileItem key={index} file={i} presenter={presenter} />;
    }
  });

  if (pendingFileCreation != null && pendingFileCreation.directory === '/') {
    children.unshift(<PendingFileCreation key={-1} presenter={pendingFileCreation} />);
  }

  if (pendingDirectoryCreation != null && pendingDirectoryCreation.directory === '/') {
    children.unshift(
      <PendingDirectoryCreation key={-1} presenter={pendingDirectoryCreation} />
    );
  }

  return <>{children}</>;
}
