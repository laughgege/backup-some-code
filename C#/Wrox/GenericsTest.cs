using System.Collections;
using System.Collections.Generic;

namespace Wrox
{
    class GenericsTest
    {

    }
    public class LinkedListNode<T>
    {
        public LinkedListNode(T value)
        {
            this.Value = value;
        }

        public T Value { get; private set; }
        public LinkedListNode<T> Next { get; internal set; }
        public LinkedListNode<T> Prev { get; internal set; }
    }

    public class LinkedList<T> : IEnumerable<T>
    {
        public LinkedListNode<T> First { get; private set; }
        public LinkedListNode<T> Last { get; private set; }
        public LinkedListNode<T> AddLast(T node)
        {
            var newNode = new LinkedListNode<T>(node);
            if (First == null)
            {
                First = newNode;
                Last = First;
            }
            else
            {
                Last.Next = newNode;
                Last = newNode;
            }
            return newNode;
        }

        public IEnumerator<T> GetEnumerator()
        {
            LinkedListNode<T> current = First;
            while (current != null)
            {
                yield return current.Value;
                current = current.Next;
            }
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

    }
}
