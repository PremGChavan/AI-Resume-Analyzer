import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);

  const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    setFiles(files);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const handleDelete = async () => {
    files.forEach(async (file) => {
      await fs.delete(file.path);
    });
    await kv.flush();
    loadFiles();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 font-semibold">
        Error: {error}
      </div>
    );
  }

  return (
    <main className="bg-[url('./images/bg-main.svg')] bg-cover">
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Wipe App Data</h1>

            <div className="mb-6">
                <p className="text-gray-600">
                Authenticated as:{" "}
                <span className="font-semibold text-blue-600">
                    {auth.user?.username}
                </span>
                </p>
            </div>

            <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Existing Files:
                </h2>
                {files.length === 0 ? (
                <p className="text-gray-500 italic">No files found.</p>
                ) : (
                <ul className="space-y-2">
                    {files.map((file) => (
                    <li
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100 transition"
                    >
                        <span className="font-medium text-gray-800">{file.name}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                        File
                        </span>
                    </li>
                    ))}
                </ul>
                )}
            </div>

            <div className="mt-6">
                <button
                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-semibold shadow-md transition duration-200"
                onClick={handleDelete}
                >
                🚨 Wipe App Data
                </button>
            </div>
        </div>
    </main>
    
  );
};

export default WipeApp;
