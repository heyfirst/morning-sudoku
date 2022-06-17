const Board = () => {
  return (
    <div className="px-4 pt-4">
      {[...Array(9).fill("")].map((_test, index) => (
        <div key={index} className="flex group justify-center">
          {[...Array(9).fill("")].map((_test, index) => (
            <div key={index} className="item-block">
              1
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
