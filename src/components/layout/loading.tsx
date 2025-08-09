const Loading = () => {
  return (
    <div className="fixed top-0 left-0 z-10 flex items-center justify-center w-full min-h-screen bg-white opacity-50">
      <div className="w-12 h-12 border-4 border-blue-600 rounded-full loader"></div>
    </div>
  );
};

export default Loading;
